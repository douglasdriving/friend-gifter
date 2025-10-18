# Contributing to Friend Gifting

Thank you for your interest in contributing to Friend Gifting! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/friend-gifting.git
   cd friend-gifting
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Set up the development environment** following the instructions in [README.md](README.md)

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-feature-name
   ```

2. **Make your changes**:
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add my new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/my-feature-name
   ```

6. **Open a Pull Request** on GitHub

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Ensure WCAG AA accessibility compliance

### Backend

- Follow RESTful API conventions
- Use Zod for input validation
- Write clear error messages
- Add proper error handling

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage for critical paths
- Test edge cases and error scenarios

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project style guidelines
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Documentation is updated if needed
- [ ] Commit messages follow Conventional Commits format

### PR Description

Include in your PR description:

1. **Summary**: Brief description of changes
2. **Motivation**: Why is this change needed?
3. **Implementation**: How did you implement it?
4. **Testing**: How did you test it?
5. **Screenshots**: If UI changes, include before/after screenshots
6. **Related Issues**: Link to related issues (closes #123)

### Review Process

- PRs require at least one approval before merging
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Be open to feedback and suggestions

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported in [Issues](https://github.com/your-org/friend-gifting/issues)
2. Try to reproduce the bug with the latest code
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., macOS 14.0]
 - Browser: [e.g., Chrome 120]
 - Node version: [e.g., 20.10.0]
 - pnpm version: [e.g., 8.14.0]

**Additional context**
Any other relevant information.
```

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Open an issue with the `enhancement` label
3. Describe the use case and expected behavior
4. Explain why this feature would be valuable

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age
- Body size
- Disability
- Ethnicity
- Gender identity and expression
- Level of experience
- Nationality
- Personal appearance
- Race
- Religion
- Sexual identity and orientation

### Our Standards

**Positive behaviors:**
- Being respectful and inclusive
- Welcoming diverse perspectives
- Accepting constructive criticism gracefully
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behaviors:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct that could be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

Report violations to the project maintainers. All reports will be reviewed and investigated confidentially.

## Questions?

If you have questions about contributing:

- Open a [GitHub Discussion](https://github.com/your-org/friend-gifting/discussions)
- Check existing documentation in `.vibe/` folder
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to Friend Gifting! 🎁
