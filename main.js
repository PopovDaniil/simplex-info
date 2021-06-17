const requestData = async (url, templateSelector = '') => {
    const templateElem = document.querySelector(templateSelector)
    const data = await (await fetch(url)).json()

    data.forEach(obj => {
        let element = templateElem.content.cloneNode(true)
        const fields = Object.keys(obj)
        fields.forEach(
            field => {
                let elem = element.querySelector(`#${field}`)
                if (elem) elem.textContent = obj[field]
            }
        )
        templateElem.after(element)
    })
}

document.addEventListener(
    'DOMContentLoaded', async () => {
        const loader = document.querySelector('#reviews-loader')
        loader.classList.remove('hide')
        await requestData(
            '/.netlify/functions/reviews', 'template#review'
        )
        loader.classList.add('hide')
    }
)