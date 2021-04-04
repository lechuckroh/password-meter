.PHONY: cover cover-lcov cover-pretty rm-cov test
cover: rm-cov
	deno test --coverage=cov_profile --unstable ./mod_test.ts

cover-pretty: cover
	deno coverage --unstable cov_profile

cover-lcov: cover
	deno coverage --unstable cov_profile --lcov > cov_profile.lcov

rm-cov:
	rm -rf cov_profile

test:
	deno test ./mod_test.ts
