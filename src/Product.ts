import Server from "./express/Server";
import EpicView from "./view/EpicView";
import EpicController from "./controller/EpicController";
import EpicModel from "./model/EpicModel";

const epicModel = new EpicModel();
const epicController = new EpicController(epicModel);
const epicView = new EpicView(epicController);

const server = new Server(epicView);
server.start();