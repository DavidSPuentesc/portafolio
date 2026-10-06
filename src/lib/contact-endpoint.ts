const FORMSPREE_ENDPOINT = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;

export function resolveContactEndpoint(value: string | undefined): string | null {
  const endpoint = value?.trim();
  return endpoint && FORMSPREE_ENDPOINT.test(endpoint) ? endpoint : null;
}
