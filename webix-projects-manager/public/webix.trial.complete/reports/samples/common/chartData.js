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
	columns: [
		{
			id: "yearmonth.sales.saledate",
			name: "Sale Date",
			type: "text",
			meta: {},
			ref: "",
			mid: "sales",
			model: "Sales",
		},
		{
			id: "sum.sales.count",
			name: "Sum Count",
			type: "number",
			meta: {},
			model: "",
		},
		{
			id: "sum.sales.total",
			name: "Sum Total",
			type: "number",
			meta: {},
			model: "",
		},
	],
	group: {
		by: [
			{
				id: "sales.saledate",
				mod: "yearmonth",
			},
		],
		columns: [
			{
				op: "sum",
				id: "sales.count",
				name: "Sum Count",
				type: "number",
			},
			{
				op: "sum",
				id: "sales.total",
				name: "Sum Total",
				type: "number",
			},
		],
	},
	meta: {
		chart: {
			axises: {
				x: {
					title: "",
					color: "#edeff0",
					lineColor: "#edeff0",
					lines: true,
					verticalLabels: true,
				},
				y: {
					title: "",
					color: "#edeff0",
					lineColor: "#edeff0",
					lines: true,
					logarithmic: false,
				},
			},
			baseColumn: null,
			chartType: "splineArea",
			dataColumn: null,
			labelColumn: "yearmonth.sales.saledate",
			legend: {
				layout: "x",
			},
			legendPosition: "bottom",
			series: [
				{
					$sub: "<div></div>",
					id: "sum.sales.count",
					meta: {
						name: "Sum Count",
						color: "#FF9700",
					},
					model: null,
					name: "Sum Count",
					show: true,
				},
				{
					$sub: "<div></div>",
					id: "sum.sales.total",
					meta: {
						name: "Sum Total",
						color: "#4CB050",
					},
					model: null,
					name: "Sum Total",
					show: true,
				},
			],
			seriesFrom: "columns",
			updatedSeries: null,
		},
	},
	query: "",
	sort: null,
	type: "chart",
};

const report_data2 = {
	desc: "Created on 12/13/2022",
	data: "products",
	joins: [
		{
			sid: "products",
			tid: "sales",
			tf: "product_id",
			id: "sales/product_id//products",
		},
		{
			sid: "sales",
			tid: "persons",
			sf: "customer_id",
			id: "sales/customer_id//persons",
		},
	],
	query: "",
	columns: [
		{
			id: "yearmonth.sales.saledate",
			name: "Sale Date",
			type: "text",
			ref: "",
			mid: "sales",
			model: "Sales",
			meta: {},
		},
		{
			id: "products.type",
			name: "Type",
			type: "text",
			ref: "",
			mid: "products",
			model: "Products",
			meta: {},
		},
		{
			id: "sum.products.price",
			name: "Sales",
			type: "number",
			meta: {},
			model: "",
		},
	],
	group: {
		by: [
			{
				id: "products.type",
			},
			{
				id: "sales.saledate",
				mod: "yearmonth",
			},
		],
		columns: [
			{
				op: "sum",
				id: "products.price",
				name: "Sales",
				type: "number",
			},
		],
	},
	buckets: [
		{
			column: "products.type",
			options: [
				{
					id: "Dessert",
					values: ["dessert"],
				},
				{
					id: "Drinks",
					values: ["coffee", "tea"],
				},
				{
					id: "Other",
				},
			],
		},
	],
	meta: {
		chart: {
			chartType: "splineArea",
			labelColumn: "yearmonth.sales.saledate",
			updatedSeries: null,
			seriesFrom: "rows",
			baseColumn: "products.type",
			dataColumn: "sum.products.price",
			series: [
				{
					id: "Dessert",
					name: "Dessert",
					model: null,
					show: true,
					meta: {
						name: "Dessert",
						color: "#FF9700",
					},
					$sub: "<div></div>",
				},
				{
					id: "Drinks",
					name: "Drinks",
					model: null,
					show: true,
					meta: {
						name: "Drinks",
						color: "#4CB050",
					},
					$sub: "<div></div>",
				},
			],
			legend: {
				layout: "x",
			},
			axises: {
				x: {
					title: "",
					color: "#edeff0",
					lineColor: "#edeff0",
					lines: true,
					verticalLabels: true,
				},
				y: {
					title: "",
					color: "#edeff0",
					lineColor: "#edeff0",
					lines: true,
					logarithmic: false,
				},
			},
			legendPosition: "right",
		},
	},
	sort: [
		{
			id: "products.type",
			mod: "asc",
		},
	],
	type: "chart",
};

const report_data3 = {
	desc: "Created on 10/05/2022",
	data: "persons",
	joins: [],
	query:
		'{"glue":"and","rules":[{"field":"persons.email","type":"text","condition":{"filter":"gmail","type":"contains"},"includes":[]}]}',
	columns: [
		{
			id: "persons.job",
			name: "Job Title",
			type: "text",
			ref: "",
			mid: "persons",
			model: "Persons",
			meta: {},
		},
		{
			id: "avg.persons.age",
			name: "Average Age",
			type: "number",
			meta: {},
			model: "",
		},
	],
	group: {
		by: [
			{
				id: "persons.job",
			},
		],
		columns: [
			{
				op: "avg",
				id: "persons.age",
				name: "Average Age",
				type: "number",
			},
		],
	},
	buckets: null,
	meta: {
		chart: {
			chartType: "radar",
			labelColumn: "persons.job",
			updatedSeries: null,
			seriesFrom: "columns",
			baseColumn: "",
			dataColumn: "",
			series: [
				{
					id: "avg.persons.age",
					name: "Average Age",
					model: null,
					show: true,
					meta: {
						name: "Average Age",
						color: "#3D0891",
						type: null,
						markerType: "d",
						fillMarker: 1,
					},
					$sub: "<div></div>",
					$row: false,
					$subHeight: 210,
					$subopen: false,
					$subContent: "$form45",
				},
			],
			legend: {
				layout: "x",
			},
			axises: {
				x: {
					title: "",
					color: "#DB152C",
					lineColor: "#3E4244",
					lines: true,
					verticalLabels: true,
					id: "x",
				},
				y: {
					title: "",
					color: "#B20A1E",
					lineColor: "#3E4244",
					lines: true,
					logarithmic: 0,
					id: "y",
				},
			},
			legendPosition: "right",
		},
	},
	sort: null,
	type: "chart",
};
