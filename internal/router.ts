type Route = (path: string, file: string, nested?: () => void) => void

export function defineRoutes(config: (route: Route) => void){

}