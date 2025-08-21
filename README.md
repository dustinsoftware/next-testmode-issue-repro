This repros an issue with Next's experimental testProxy mode. It uses the AWS SDK to put and read an item in an s3 bucket. A valid AWS session and s3 bucket is required to repro this issue. Replace the bucket name with a bucket your account has access to.

To repro:
```
USE_TEST_PROXY=1 BUCKET_NAME=my-cool-bucket npm run dev
```

This also repros in standalone mode:
```
USE_TEST_PROXY=1 npm run app:build
BUCKET_NAME=my-cool-bucket npm run app:start
```

Put operations will fail with `fetch failed: expect header not supported`. Setting `USE_TEST_PROXY=0` or leaving it unset will avoid the issue.

More details:

The AWS S3 client uses a `expect: 100-continue` header when doing some PUT operations. For example, [here](https://github.com/aws/aws-sdk-js/blob/657d6feb00447c8be1d65158a0ecc0585b70ed60/lib/services/s3.js#L402-L410).

Undici will throw if any request attempts to include the `expect` header [here](https://github.com/nodejs/undici/blob/c83b084879fa0bb8e0469d31ec61428ac68160d5/lib/core/request.js#L354).

When testProxy is enabled, even if the app is _not_ being used in integration tests, undici will throw due to the unexpected header. Disabling testProxy works around the issue.

