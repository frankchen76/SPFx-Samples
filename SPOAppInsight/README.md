## spfx-appinsight

This is a sample SPFx extension to use Azure Application Insight for SPO telemetry. replace the instrumentation key in the code.

### Testing
For testing, create appinsightkey.json under root folder to include the following content
```JSON
{
    "key": "[ApplicationInsightKey]"
}

```

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
