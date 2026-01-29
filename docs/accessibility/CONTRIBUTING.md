# Contributing to W3AG

Thank you for your interest in making Web3 accessible to everyone! This document provides guidelines for contributing to the Web3 Accessibility Guidelines.

## How to Contribute

### Reporting Accessibility Barriers

If you've encountered an accessibility barrier in a Web3 application that isn't covered by W3AG:

1. Open an issue with the label `new-barrier`
2. Describe the barrier and which disability types it affects
3. If possible, suggest which principle it falls under
4. Share examples of applications with this barrier

### Proposing New Success Criteria

1. Fork the repository
2. Create a branch: `sc/[principle]-[guideline]-[number]`
3. Add your success criterion following the format in the spec
4. Include:
   - Clear, testable requirement
   - Conformance level (A, AA, or AAA) with justification
   - At least one technique demonstrating compliance
   - At least one failure example
5. Open a pull request

### Adding Techniques & Patterns

1. Create a file in `/techniques/[principle]/`
2. Include:
   - Working code examples
   - Screen reader testing results
   - Keyboard navigation verification
   - Browser/wallet compatibility notes

### Improving Documentation

- Fix typos, clarify language, add examples
- Translate into other languages
- Create video tutorials or guides

## Code of Conduct

- Be respectful and inclusive
- Center the voices of people with disabilities
- Assume good intent
- Focus on the goal: Web3 for everyone

## Questions?

Open a discussion or reach out to maintainers.
