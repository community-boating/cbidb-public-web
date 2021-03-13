## Javascript/Typescript style

- Unless explicitly stated to the contrary, follow airbnb javascript guide:  https://github.com/airbnb/javascript
- Use tabs over spaces for leading whitespace
- Avoid null in favor of `Option<T>` types
- Avoid the `any` type; always type function parameters unless they can be inferred from context (e.g. an anonymous function passed into another function)
- Don't sacrifice readability for performance

## Application structure
- Any API calls should utilize `APIWrapper`
- If the path of an API endpoint is api.community-boating.org/v1/foo/bar/baz,
  the ApiWrapper should be located at src/async/foo/bar/baz.ts
- Any application routes should utilize `RouteWrapper`; RWs should live in src/app/routes
- Never hardcode an API URL or application route anywhere except the creation of the APIWrapper or RouteWrapper (e.g. always go through the wrapper object to reference a path)

## Git management
- New features should be developed on (lower-kebab-cased) git branches prefixed with `dev/` e.g. `dev/staggered-payments`
- Merge requests should target either the master branch, or a release branch prefixed with `release/` e.g. `release/2021-spring`
- Release branches and the master branch are protected and will be managed by Jon