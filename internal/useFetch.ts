import { ref } from "vue";

export function useFetch(fetcher: () => Promise<any>) {
  const pending = ref(true);
  const data = ref<any>(null);
  const error = ref(null);

	return {
		pending, data, error
	}
}
