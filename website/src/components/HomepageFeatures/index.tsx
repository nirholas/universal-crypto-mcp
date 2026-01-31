import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '150+ Tools',
    Svg: require('@site/static/img/tools.svg').default,
    description: (
      <>
        DeFi, NFTs, payments, and more. Access Uniswap, Aave, OpenSea,
        and dozens of other protocols through a unified interface.
      </>
    ),
  },
  {
    title: 'x402 Payments',
    Svg: require('@site/static/img/payment.svg').default,
    description: (
      <>
        Built-in payment rails for AI agents. Support for HTTP 402,
        multi-chain payments, and automatic handling of payment requirements.
      </>
    ),
  },
  {
    title: 'Multi-Chain',
    Svg: require('@site/static/img/chains.svg').default,
    description: (
      <>
        Ethereum, Base, Arbitrum, Optimism, Polygon, and Solana.
        One API for all major blockchain networks.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
