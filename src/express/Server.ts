import express, { Application } from "express"
import EpicView from "../view/EpicView"
import path from "path"
import cors from 'cors';

export default class Server {
    private readonly app: Application

    constructor(private readonly epicView: EpicView){
        this.app = express()
        this.configure()
        this.routes()
        this.static()
    }

    readonly configure = (): void => {
        // Configuración de CORS
        this.app.use(cors({origin: 'http://localhost:4200',methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],allowedHeaders: ['Content-Type', 'Authorization']}))

        
        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    }

    readonly routes = (): void => {
        this.app.use('/', this.epicView.router)
    }

    readonly static = (): void =>{
        this.app.use(express.static(path.join(__dirname, '../../assets/img')))
    }

    readonly start = (): void => {
        const port = 1800
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    }
}
