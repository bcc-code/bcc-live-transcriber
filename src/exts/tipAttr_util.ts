export default function tipAttr(att: string) {
    return {
        default: null,
        parseHTML: (element: Element) => element.getAttribute(`data-${att}`),
        renderHTML: (attributes: any) => {
            if (!attributes[att]) {
                return {}
            }

            return {
                [`data-${att}`]: attributes[att]
            }
        },
    }
}