import Wallet from "../models/Wallet";

export const isWallet = async (req, res, next) => {
    const wallet = await Wallet.findAll({
        where: {
            user_id: req.session.user,
        },
    });

    if (!wallet.length) {
        res.redirect("/carteiras?wallet=not");
        return;
    }
    next();
};
