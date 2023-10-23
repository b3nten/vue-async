import { VNode, h } from "vue"

const elements = new Proxy(h, {
	get(_, prop) {
		return function (a, b) {
			return h(prop as string, a, b)
		}
	}
}) as unknown as {
	[K in keyof HTMLElementTagNameMap]: (props?: Parameters<typeof h>[1], children?: Parameters<typeof h>[2]) => VNode
}

export default elements
