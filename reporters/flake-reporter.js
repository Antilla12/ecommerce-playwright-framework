/**
 * Tracks tests that failed at least once but eventually passed on retry.
 * These are your flaky tests — green in CI, but silently unreliable.
 * A test suite can be 100% "passing" and still be full of these.
 */
class FlakeReporter {
  constructor() {
    this.flaky = [];
    this.failed = [];
  }

  onTestEnd(test, result) {
    if (result.status === 'passed' && result.retry > 0) {
      this.flaky.push({
        title: test.titlePath().slice(1).join(' > '),
        retriesNeeded: result.retry,
        file: test.location.file,
      });
    }
    if (result.status === 'failed' && result.retry === test.retries) {
      this.failed.push({
        title: test.titlePath().slice(1).join(' > '),
        error: result.error?.message?.split('\n')[0],
      });
    }
  }

  onEnd(result) {
    console.log('\n--- Flake Report ---');
    if (this.flaky.length === 0) {
      console.log('No flaky tests detected this run.');
    } else {
      console.log(`${this.flaky.length} test(s) needed a retry to pass:`);
      for (const t of this.flaky) {
        console.log(`  ⚠ ${t.title} (retries: ${t.retriesNeeded}) — ${t.file}`);
      }
    }

    if (this.failed.length > 0) {
      console.log(`\n${this.failed.length} test(s) failed permanently:`);
      for (const t of this.failed) {
        console.log(`  ✖ ${t.title} — ${t.error}`);
      }
    }
    console.log('--------------------\n');
  }
}

module.exports = FlakeReporter;
