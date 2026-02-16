function login(url, usersCount) {
	return new Promise(function(res) {
		var token = sessionStorage.getItem("login-token");
		if (token) {
			res(token);
			return;
		}

		function doLogin() {
			webix.ajax(url + "login?id=" + this.config.user).then(raw => {
				win.close();

				var token = raw.text();
				sessionStorage.setItem("login-token", token);
				res(token);
			});
		}

		const usersList = [
			{ view: "button", value: "Alex Brown", user: 1, click: doLogin },
			{ view: "button", value: "Sinister Alpha", user: 2, click: doLogin },
			{ view: "button", value: "Alan Raichu", user: 3, click: doLogin },
			{ view: "button", value: "Diana Wronsky", user: 4, click: doLogin },
			{
				view: "button",
				value: "Henry Farfetch'd",
				user: 5,
				click: doLogin,
			},
			{ view: "button", value: "Jeen", user: 17, click: doLogin },
			{ view: "button", value: "Reno Daloni", user: 85, click: doLogin },
			{ view: "button", value: "Rami Avaski", user: 86, click: doLogin },
			{ view: "button", value: "Berni Mayour", user: 87, click: doLogin },
			{ view: "button", value: "Galancy Alex", user: 88, click: doLogin },
		];

		var win = webix.ui({
			modal: true,
			view: "window",
			position: "center",
			head: "Select user",
			body: {
				view: "form",
				rows: usersList.slice(0, usersCount || 3),
			},
		});
		win.show();
	});
}

function loginUser(url, id) {
	return webix.ajax(url + "login?id=" + id).then(raw => raw.text());
}
