import { CocCocStrings } from './DataCtrl'

const logDefData = {
	ref: window.location.href,
	time: new Date(),
	v: +new Date()
}

function toQueryString(obj) {
	let qs = ""

	if (typeof obj !== "object") {
		return qs
	}

	Object.entries(obj).forEach(([key, value]) => qs += `${key}=${value}&`)
	qs.slice(0, qs.length - 1)

	return qs
}

const LogCtrl = {
	renderComponent: component => {
		const qs = toQueryString({ type: "Exist", component, ...logDefData });
		(new Image()).src = `${CocCocStrings.COCCOC_LOG_URL}?${qs}`
	},

	clickOccur: (params = {}) => {
		const qs = toQueryString({ type: "Click", ...params, ...logDefData });
		(new Image()).src = `${CocCocStrings.COCCOC_LOG_URL}?${qs}`
	}
}

export default LogCtrl
