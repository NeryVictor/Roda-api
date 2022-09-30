import { Book } from '../entities/Book';
import { bookRepository } from '../repositories/bookRepository';
import { Request, Response } from "express"

export class BookController {
    
	static create = async (req: Request, res: Response) => {
        const {  name, genres, description, condition } = req.body;
        const users = req.user;

        try {
            const book = bookRepository.create({name,genres,description,condition,users})
            await bookRepository.save(book)
        } catch (error) {
            return res.status(400)
        }

        return res.status(201).json('book Created')

    }

	static listAllBooks = async (req: Request, res: Response) => {      
        const books = await bookRepository.find({
            relations: {
                users: true
            },
            select: {
                users: {
                    iduser: true,
                    name: true,
                    email:true, 
                    bio:true, 
                    imgurl:true
                }
            }
        })
        return res.send(books)
    }	

    static bookByName =  async (req: Request, res: Response) => {
        const name: string = req.params.name
        
        let books: Book[]
        try {
            books = await bookRepository
            .createQueryBuilder("book")
            .where("book.name like :name", { name:`%${name}%` })
            .getMany();
        } catch (error) {
            return res.status(404).send("book not found")            
        }
        
        return res.send(books)
    }

}