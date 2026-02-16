const report_data1 = {
	desc: "Created on 12/02/2020",
	data: "persons",
	joins: [],
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
				id: "",
				name: "Count",
				type: "number",
			},
		],
	},
	buckets: [
		{
			column: "persons.age",
			options: [
				{
					id: "19-30",
					values: ["19", "20", "21", "22", "23", "30", "29"],
				},
				{
					id: "Other",
				},
			],
		},
	],
	meta: {
		freeze: 0,
	},
	sort: null,
	type: "table",
};

const report_data2 = {
	desc: "Created on 12/02/2020",
	data: "sales",
	joins: [
		{
			sid: "sales",
			tid: "products",
			sf: "product_id",
			id: "sales/product_id//products",
		},
	],
	query:
		'{"glue":"and","rules":[{"field":"products.name","type":"text","condition":{"filter":"tea","type":"contains"},"includes":[]}]}',
	columns: [
		{
			id: "sales.id",
			name: "ID",
			type: "number",
			ref: "",
			mid: "sales",
			model: "Sales",
			meta: {},
			key: true,
			width: 69,
		},
		{
			id: "sales.saledate",
			name: "Sale Date",
			type: "date",
			ref: "",
			mid: "sales",
			model: "Sales",
			meta: {},
			width: 121,
		},
		{
			id: "sales.place_id",
			name: "Place",
			type: "reference",
			ref: "places",
			mid: "sales",
			model: "Sales",
			meta: {},
			width: 174,
		},
		{
			id: "sales.count",
			name: "Count",
			type: "number",
			ref: "",
			mid: "sales",
			model: "Sales",
			meta: {},
			width: 74,
		},
		{
			id: "sales.product_id",
			name: "Product",
			type: "reference",
			ref: "products",
			mid: "sales",
			model: "Sales",
			meta: {},
			width: 109,
		},
		{
			id: "sales.total",
			name: "Total",
			type: "number",
			ref: "",
			mid: "sales",
			model: "Sales",
			meta: {},
			width: 88,
		},
		{
			id: "sales.customer_id",
			name: "Customer",
			type: "reference",
			ref: "persons",
			mid: "sales",
			model: "Sales",
			meta: {},
		},
		{
			id: "sales.type",
			name: "Payment",
			type: "picklist",
			ref: "regions",
			mid: "sales",
			model: "Sales",
			meta: {},
		},
	],
	group: null,
	meta: {
		freeze: 0,
	},
	sort: [
		{
			id: "sales.place_id",
			mod: "asc",
		},
		{
			id: "sales.saledate",
			mod: "asc",
		},
	],
	type: "table",
};
