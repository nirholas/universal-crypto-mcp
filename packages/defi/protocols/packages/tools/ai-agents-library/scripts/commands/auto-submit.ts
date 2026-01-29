#!/usr/bin/env node
/**
 * 自动提交命令
 * 用于自动处理 GitHub Issue 并创建 PR
 */
import { Octokit } from '@octokit/rest';
import 'dotenv/config';
import { kebabCase } from 'lodash-es';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import pMap from 'p-map';

import { agentsDir, config, githubHomepage } from '../core/constants';
import { checkHeader } from '../utils/common';
import { getBuildLocaleAgentFileName, writeJSON } from '../utils/file';
import { Logger } from '../utils/logger';
import { CheckEnglishIdentifier, formatAgentJSON } from '../validators/agent-validator';

// GitHub 标签常量
const GENERATE_LABEL = '🤖 Agent PR';
const SUCCESS_LABEL = '✅ Auto Check Pass';
const ERROR_LABEL = '🚨 Auto Check Fail';

/**
 * 自动提交处理器类
 * 负责处理 GitHub Issue 并自动创建 PR
 */
class AutoSubmit {
  owner = 'speraxos';
  repo = 'sperax-ai-agents';
  issueNumber = Number(process.env.ISSUE_NUMBER);
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ auth: `token ${process.env.GH_TOKEN}` });
  }

  /**
   * 执行自动提交流程
   */
  async run() {
    try {
      await this.submit();
    } catch (error) {
      await this.removeLabels(GENERATE_LABEL);
      await this.removeLabels(SUCCESS_LABEL);
      await this.addLabels(ERROR_LABEL);
      await this.createComment(
        [
          '**🚨 自动检查失败:**',
          '- 修复下方错误',
          `- 为当前 Issue 添加标签 \`${GENERATE_LABEL}\``,
          '- 等待自动化重新生成',
          '```bash',
          error?.message,
          '```',
        ].join('\n'),
      );
      Logger.error('自动提交流程失败', error);
    }
  }

  /**
   * 提交处理逻辑
   */
  async submit() {
    const issue = await this.getIssue();
    if (!issue) return;
    Logger.start('获取 Issue 信息', `#${this.issueNumber}`);

    const { agent, locale } = await this.formatIssue(issue);

    // 验证标识符
    if (
      !agent.identifier ||
      agent.identifier === 'undefined' ||
      agent.identifier === 'index' ||
      !CheckEnglishIdentifier(agent.identifier)
    ) {
      await this.createComment(
        [
          `**🚨 自动检查失败:** 标识符无效`,
          '- 重命名你的 Agent 标识符',
          `- 为当前 Issue 添加标签 \`${GENERATE_LABEL}\``,
          '- 等待自动化重新生成',
          '---',
          agent.identifier,
        ].join('\n'),
      );
      await this.removeLabels(GENERATE_LABEL);
      await this.addLabels(ERROR_LABEL);
      Logger.error('自动检查失败', '标识符无效');
      return;
    }

    const comment = this.genCommentMessage(agent);
    const agentName = agent.identifier;
    const fileName = getBuildLocaleAgentFileName(agentName, locale);
    const filePath = resolve(agentsDir, fileName);

    // 检查同名文件
    if (existsSync(filePath)) {
      await this.createComment(
        [
          `**🚨 自动检查失败:** 同名文件已存在 <${`${githubHomepage}/blob/main/agents/${fileName}`}>`,
          '- 重命名你的 Agent 标识符',
          `- 为当前 Issue 添加标签 \`${GENERATE_LABEL}\``,
          '- 等待自动化重新生成',
          '---',
          comment,
        ].join('\n'),
      );
      await this.removeLabels(GENERATE_LABEL);
      await this.addLabels(ERROR_LABEL);
      Logger.error('自动检查失败', '同名文件已存在');
      return;
    }

    // 在 Issue 中添加评论
    await this.createComment(comment);
    Logger.success('自动检查通过');

    // 提交并创建 PR
    await this.gitCommit(filePath, agent, agentName);
    Logger.start('提交到分支', `agent/${agentName}`);

    await this.addLabels(SUCCESS_LABEL);
  }

  /**
   * Git 提交流程
   */
  async gitCommit(filePath: string, agent: any, agentName: string) {
    execSync('git diff');
    execSync('git config --global user.name "speraxos"');
    execSync('git config --global user.email "speraxos@users.noreply.github.com"');
    execSync('git pull');
    execSync(`git checkout -b agent/${agentName}`);
    Logger.info('切换分支', `agent/${agentName}`);

    // 生成文件
    writeJSON(filePath, agent);
    Logger.file('create', filePath);

    // 代码格式化
    execSync(`echo "module.exports = require('@nirholasos/lint').prettier;" >> .prettierrc.cjs`);
    execSync('bun run prettier');
    Logger.info('代码格式化完成');

    // 提交代码
    execSync('git add -A');
    execSync(`git commit -m "🤖 chore(auto-submit): Add ${agentName} (#${this.issueNumber})"`);
    execSync(`git push origin agent/${agentName}`);
    Logger.success('推送 Agent 完成');

    // 创建 PR
    const comment = this.genCommentMessage(agent);
    await this.createPullRequest(
      agentName,
      agent.author,
      [comment, `[@${agent.author}](${agent.homepage}) (resolve #${this.issueNumber})`].join('\n'),
    );
    Logger.success('创建 PR 完成');
  }

  /**
   * 生成评论消息
   */
  genCommentMessage(json: any) {
    return ['🤖 自动生成的 Agent 配置文件', '```json', JSON.stringify(json, null, 2), '```'].join(
      '\n',
    );
  }

  /**
   * 创建 Pull Request
   */
  async createPullRequest(agentName: string, author: string, body: string) {
    const { owner, repo, octokit } = this;
    await octokit.pulls.create({
      base: 'main',
      body,
      head: `agent/${agentName}`,
      owner: owner,
      repo: repo,
      title: `✨ feat(agent): ${agentName} @${author}`,
    });
  }

  /**
   * 获取 Issue 信息
   */
  async getIssue() {
    const { owner, repo, octokit, issueNumber } = this;
    const issue = await octokit.issues.get({
      issue_number: issueNumber,
      owner,
      repo,
    });
    return issue.data;
  }

  /**
   * 添加标签
   */
  async addLabels(label: string) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.addLabels({
      issue_number: issueNumber,
      labels: [label],
      owner,
      repo,
    });
  }

  /**
   * 移除标签
   */
  async removeLabels(label: string) {
    const { owner, repo, octokit, issueNumber } = this;
    const issue = await this.getIssue();

    const baseLabels = issue.labels.map((l) => (typeof l === 'string' ? l : l.name));
    const removeLabels = baseLabels.filter((name) => name === label);

    // 并行移除所有匹配的标签
    await pMap(
      removeLabels,
      async (labelToRemove) => {
        await octokit.issues.removeLabel({
          issue_number: issueNumber,
          name: labelToRemove,
          owner,
          repo,
        });
      },
      { concurrency: config.concurrency }, // 使用配置中的并发数控制
    );
  }

  /**
   * 创建评论
   */
  async createComment(body: string) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.createComment({
      body,
      issue_number: issueNumber,
      owner,
      repo,
    });
  }

  /**
   * Markdown 转 JSON
   */
  markdownToJson(markdown: string) {
    const lines = markdown.split('\n');
    const json: any = {};
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      if (checkHeader(line)) {
        if (currentKey) {
          json[currentKey] = currentValue.trim();
        }
        currentKey = line.replace('### ', '').trim();
        currentValue = '';
      } else {
        currentValue += line + '\n';
      }
    }

    if (currentKey) {
      json[currentKey] = currentValue.trim();
    }

    return json;
  }

  /**
   * 格式化 Issue 内容
   */
  async formatIssue(data: any) {
    const json = this.markdownToJson(data.body);
    const locale = json.locale || 'en-US';

    const agent = await formatAgentJSON(
      {
        author: data.user.login,
        config: {
          systemRole: json.systemRole,
        },
        createdAt: new Date().toISOString().split('T')[0],
        homepage: data.user.html_url,
        identifier: kebabCase(json.identifier),
        meta: {
          avatar: json.avatar,
          description: json.description,
          tags: json.tags?.split(',').map((tag: string) => tag.trim()) || [],
          title: json.title,
        },
        schemaVersion: 1,
      },
      locale,
    );

    return { agent, locale };
  }
}

// 执行自动提交
await new AutoSubmit().run();
