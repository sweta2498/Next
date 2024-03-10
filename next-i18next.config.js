const path = require("path");
module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'fr', 'it', 'de', 'nl'],
	},
	localePath: path.resolve("./public/locales"),
}
