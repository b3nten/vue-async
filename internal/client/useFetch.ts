import { ref } from "vue";

export function useFetch(fetcher: () => Promise<any>) {
  const pending = ref(false);
  const data = ref<any>(null);
  const error = ref<any>(null);

	pending.value = true;
  fetcher().then((d: any) => {
    data.value = d;
  }).catch((err: any) => {
    error.value = err;
  }).finally(() => {
    pending.value = false;
  });

	return {
		pending, data, error
	}
}
