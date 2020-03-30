## sp-2019-sample-wp

This is a sample of SP2019 web part and demonstrated calling Integrated Windows Authentication Web API from SPFx

* pnp js v1.6.3
* polyfill which make PnP JS working for IE11.
* tslint override

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
