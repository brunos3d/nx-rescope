# nx-rescope

Nx has rescoped the `@nrwl` packages to `@nx` in version 16 ([read more](https://nx.dev/recipes/other/rescope)). This is a tool to help you migrate your workspace to the new scope format.

## Usage

```bash
npx nx-rescope
```

## Options

### `--dry-run`

Do not save the changes to the package.json file and do not install the new dependencies.

### `--force`

Force the execution of the script even if the conditions are not met.

### `--update-overrides`

Update the overrides section of the package.json file.

### `--skip-install`

Skip the installation of the new dependencies.
