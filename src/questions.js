import { PrismaClient } from "@prisma/client";


export const getUserQuestions = async (req, res) => {
    const dataBase = new PrismaClient();
    const { id } = req.params;
    
    const questions = await dataBase.question.findMany({
        where: {
        userId: id,
        },
    });
    
    res.json(questions);
}  