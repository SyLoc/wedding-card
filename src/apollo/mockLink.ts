import { ApolloLink, Observable } from "@apollo/client";
import { MOCK_COUNTRIES } from "@/mocks/countries";

const FAKE_API_DELAY_MS = 800;

export const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) {
        return;
      }

      if (operation.operationName === "GetCountries") {
        observer.next({
          data: { countries: MOCK_COUNTRIES },
        });
        observer.complete();
        return;
      }

      observer.error(
        new Error(`Unmocked GraphQL operation: ${operation.operationName}`),
      );
    }, FAKE_API_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  });
});
