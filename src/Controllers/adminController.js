const { getUserByUsername } = require("../Services/userService");
const { addNewUser, getAllUsers, updateUserInfo } = require("../Services/userService");
const { getAllUserShifts, updateShiftInfo } = require('../Services/shiftService');
const { changeToLocalTimeZone } = require('../Miscellaneous/changeToLocalTimeZone');
const path = "../Views/Admin";

// --- Widok Strony Głównej
exports.showHomePage = async (req, res) => {
    const user = await getUserByUsername(req.session.username);
    res.render(`${path}/home`, { layout: false });
}

// --- Widok Strony Zarządzani Użytkownikami
exports.showManageUserPage = async (req, res) => {
    try 
    {
        const users = await getAllUsers();
        const filteredUsers = users.filter(user => user.username !== "Admin");
        res.render(`${path}/manageUsers`, { layout: false, users: filteredUsers, message: null });
    } catch (error) {
        console.error('Błąd podczas pobierania użytkowników:', error);
        res.render(`${path}/manageUsers`, { layout: false, users: [], message: 'Nie udało się pobrać listy użytkowników.' });
    }
}

// --- Endpoint od edytowania użytkownika
exports.editUser = async (req, res) => {
    const userId = req.params.userId;

    try 
    {
        await updateUserInfo(userId, req.body);
        res.render(`${path}/manageUsers`, { layout: false, users: [], message: "Pomyślnie zmieniono dane użytkownika." });

    } catch (error) {
        console.error('Błąd podczas pobierania użytkowników:', error);
        res.render(`${path}/manageUsers`, { layout: false, users: [], message: 'Nie udało się zmienić danych użytkownika.' });
    }
}

// --- Widok Strony od Dodawania Użytkownika
exports.showAddUserPage = async (req, res) => {
    const user = await getUserByUsername(req.session.username);
    res.render(`${path}/addUser`, { layout: false, errorMessage: null });
}

exports.addNewUser = async (req, res) => {
    try {

        const allUsers = await getAllUsers();

        if(allUsers.find(user => user.username === req.body.username))
        {
            res.render(`${path}/addUser`, { layout: false, errorMessage: 'Użytkownik o podanym loginie już istnieje.' });
            return;
        }

        const newUser = await addNewUser(req.body);

        if (newUser) {
            res.render(`${path}/addUser`, { layout: false, errorMessage: 'Pomyślnie dodano nowego użytkownika!' });
        } else {
            res.render(`${path}/addUser`, { layout: false, errorMessage: 'Nie udało się dodać użytkownika.' });
        }
    } catch (error) {
        console.error('Błąd podczas dodawania użytkownika:', error);
        res.render(`${path}/addUser`, { layout: false, errorMessage: 'Wystąpił błąd podczas dodawania użytkownika.' });
    }
}

// --- Widok Strony Zarzązania Zmianami Użytkownika
exports.showManageShiftsPage = async (req, res) => {
    try 
    {
        const users = await getAllUsers();
        const filteredUsers = users.filter(user => user.username !== "Admin");

        const userId = req.params.userId;
        let shifts = [];

        if (userId) {
            shifts = await getAllUserShifts(userId);
            shifts.forEach(shift => { changeToLocalTimeZone(shift)});
            shifts.reverse();
        }

        console.log("> ", userId);

        res.render(`${path}/manageShifts`, { 
            layout: false, 
            users: filteredUsers, 
            shifts: shifts, 
            selectedUserId: userId,
            message: null
        });
 
    } catch (error) {
        res.render(`${path}/manageShifts`, { layout: false, users: [], shifts: [], selectedUserId: null, message: null });
    }
}

// --- Endpoint od edytowania zmiany
exports.editShift = async (req, res) => {
    const shiftId = req.params.shiftId;
    try {
        await updateShiftInfo(shiftId, req.body);
        res.render(`${path}/manageShifts`, { layout: false, users: [], shifts: [], selectedUserId: shiftId, message: "Pomyślnie zmieniono dane użytkownika." });
    } catch (error) {
        console.error('Błąd podczas aktualizacji zmiany:', error);
        res.render(`${path}/manageUsers`, { layout: false, users: [], shifts: [], selectedUserId: shiftId, message: "Nie udało się zaktualizować zmiany." });
    }
}
