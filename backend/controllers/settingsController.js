exports.getSettingsPage = (req, res) => {
    try {
        const settingsData = null;

        res.render('settings', {
            page: 'settings',
            pageTitle: 'Cài đặt | Admin',
            settingsData,
            contentPage: 'settingsContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};