module.exports = function parse(data) {
    let expenses = data.expenses;
    let response = {
        users: {},
        games: 0
    };

    expenses.forEach(function(expense){
        if (filterExpense(expense)) {
            return;
        }

        response.games++;

        let users = expense.users;
        users.forEach(function(user){
            if (isUserBlocked(user.user.first_name)){
                return
            }

            if (response.users[user.user_id]) {
                let stored_user = response.users[user.user_id];
                let balance = parseNumber(user.net_balance);
                stored_user.balance += balance; 
            } else {
                let balance = parseNumber(user.net_balance);
                response.users[user.user_id] = {
                    user_id: user.user_id,
                    full_name: parseString(user.user.first_name) + " " + parseString(user.user.last_name),
                    balance: balance,
                    photo: user.user.picture.medium,
                };
            }
        });
    });

    // since games are even
    response.games /= 2;

    return response;
}

function parseString(value) {
    return (value == null) ? "" : value
}

function parseNumber(value) {
    return (value == null) ? 0 : parseFloat(value)
}

function filterExpense(expense) {
    if (expense.category.name != "Games" ){
        return true
    }

    if (expense.deleted_at != null) {
        return true
    }

    return false
}

function isUserBlocked(first_name) {
    if (first_name.includes("Murali")) {
        return true
    }
    return false
}
