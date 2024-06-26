import { type Ref, ref } from 'vue';
export interface ReturnValue {
  loading: Ref<boolean>;
}
export type Service<T extends any[], U extends Promise<any>> = (...args: [...T]) => U;
export const useService = <T extends any[], U extends Promise<any>>(
  service: Service<T, U>,
): [Service<T, U>, ReturnValue] => {
  const loading = ref(false);
  let currPromise: U | undefined;

  const wrapedService = async (...args: [...T]) => {
    loading.value = true;
    currPromise = service(...args);
    currPromise.finally(() => {
      loading.value = false;
      currPromise = undefined;
    });
    return currPromise;
  };

  return [wrapedService as Service<T, U>, { loading }];
};
