# nx-rescope

The `nx-rescope` tool is designed to assist you in migrating your workspace to the new scope format introduced in Nx version 16. This update involved transitioning the `@nrwl` packages to the `@nx` scope. To learn more about this change, refer to the [official documentation](https://nx.dev/recipes/other/rescope).

## Usage

```bash
npx nx-rescope
```

## Warning

Nx already has a built-in command to apply these migrations

```bash
nx migrate latest
npx nx migrate --run-migrations --create-commits
```

## What does it do?

The `nx-rescope` tool will do the following:

- Update the `@nrwl` dependencies to `@nx`
- Update the `@nrwl` devDependencies to `@nx`
- Update the `@nrwl` peerDependencies to `@nx`
- Update the `@nrwl` overrides to `@nx` (if the `--update-overrides` option is enabled)
- Install the new dependencies using your preferred package manager

You can check the current supported rescope/rename packages [here](./src/nx-rescoped-plugins.mjs).

## What does it NOT do?

While the `nx-rescope` tool assists in migrating your workspace to the new scope format, it does not perform the following actions:

- Update the version of the `@nrwl`/`@nx` packages. It focuses on updating the scope format rather than upgrading the package versions (use `nx migrate latest` instead).
- Update the `package.json` files of your individual projects. Only the workspace's `package.json` file will be updated during the migration.
- Modify other configuration files such as `tsconfig.json`, `jest.config.js`, etc. The tool solely focuses on updating the workspace's `package.json` file.

It's important to note that you may need to handle these aspects manually if necessary.

## What is the recommended approach?

The recommended approach is to use the `nx-rescope` tool in conjunction with the `nx migrate latest` command. This will ensure that your workspace is up-to-date with the latest version of Nx and that the scope format is updated accordingly.

To make sure that your workspace is ready for the migration, you can run the following commands in sequence:

```bash
nx migrate latest
```

Then use your package manager of choice to install the new dependencies, and to make sure you are using the latest version of Nx or at least the version 16.0.0:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Finally, run the `nx-rescope` tool to update the scope format:

```bash
npx nx-rescope
```

## Options

| Option               | Description                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`             | Display a help message                                                                                                                                                                 |
| `--dry-run`          | By using this option, the tool will perform a dry run, meaning it will simulate the changes without modifying the package.json file or installing new dependencies.                    |
| `--force`            | If you encounter any conditions that prevent the execution of the script, you can use the --force option to override these conditions and force the tool to proceed.                   |
| `--update-overrides` | Enabling this option will update the overrides section of the package.json file, ensuring that it aligns with the new scope format.                                                    |
| `--skip-install`     | If you don't want the tool to automatically install the new dependencies, you can utilize the --skip-install option. This is useful if you prefer to handle the installation manually. |

##

Feel free to modify and enhance this readme file according to your specific project requirements.
