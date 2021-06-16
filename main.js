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
    'DOMContentLoaded', () => requestData(
        '/.netlify/functions/reviews', 'template#review'
    )
)

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
