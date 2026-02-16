const report_data1 = {
	desc: "Created on 12/02/2020",
	data: "persons",
	joins: [
		{
			sid: "persons",
			tid: "sales",
			tf: "customer_id",
			id: "sales/customer_id//persons",
		},
	],
	query: "",
	columns: [
		{
			id: "count.",
			name: "Count",
			type: "number",
			meta: {},
			model: "",
		},
		{
			id: "persons.age",
			name: "Age",
			type: "number",
			ref: "",
			mid: "persons",
			model: "Persons",
			meta: {},
		},
	],
	group: {
		by: [
			{
				id: "persons.age",
			},
		],
		columns: [
			{
				op: "count",
				id: "count.",
				name: "Count",
				type: "number",
			},
		],
	},
	buckets: null,
	meta: {
		value: "count.",
		label: "persons.age",
		color: "count.",
	},
	sort: null,
	type: "treemap",
};

const report_data2 = {
	desc: "Created on 12/02/2020",
	data: "products",
	joins: [
		{
			sid: "products",
			tid: "sales",
			tf: "product_id",
			id: "sales/product_id//products",
		},
	],
	query:
		'{"glue":"and","rules":[{"field":"sales.saledate","type":"date","condition":{"filter":"2019-12-31T21:00:00.000Z","type":"greaterOrEqual"},"includes":[]},{"field":"sales.saledate","type":"date","condition":{"filter":"2020-12-30T21:00:00.000Z","type":"lessOrEqual"},"includes":[]}]}',
	columns: [
		{
			id: "sum.sales.total",
			name: "Sum Total",
			type: "number",
			meta: {},
			model: "",
		},
		{
			id: "products.name",
			name: "Name",
			type: "text",
			ref: "",
			mid: "products",
			model: "Products",
			meta: {},
		},
	],
	group: {
		by: [
			{
				id: "products.id",
			},
			{
				id: "products.name",
			},
		],
		columns: [
			{
				op: "sum",
				id: "sales.total",
				name: "Sum Total",
				type: "number",
			},
		],
	},
	meta: {
		value: "sum.sales.total",
		label: "products.name",
		color: "sum.sales.total",
	},
	sort: null,
	type: "heatmap",
};
