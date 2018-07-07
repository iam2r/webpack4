export const Home = resolve => {
    require.ensure(['../pages/home'], () => {
        resolve(require('../pages/home'))
    },'home')
}

export const Err = resolve => {
    require.ensure(['../pages/err'], () => {
        resolve(require('../pages/err'))
    },'err')
}