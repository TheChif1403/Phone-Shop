exports.getFinancePage = (req, res) => {
    try {
        const financeData = null;

        res.render('finance', {
            page: 'finance',
            pageTitle: 'Tài chính | Admin',
            financeData,
            contentPage: 'financeContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};