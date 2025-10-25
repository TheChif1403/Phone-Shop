exports.getCustomersPage = (req, res) => {
    try {
        const customersData = null;

        res.render('customers', {
            page: 'customers',
            pageTitle: 'Khách hàng| Admin',
            customersData,
            contentPage: 'customersContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};