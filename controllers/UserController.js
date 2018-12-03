class UserController{
    constructor( formId, tableId){

        this.formEl = document.getElementById(formId)
        this.tableIdEl = document.getElementById(tableId)

        this.onSubmit()
    
    }

    /**
     * Criando um evento no botão submit do form.
     * usamos o objeto document para acessar os métodos desse objeto
     * o método getElementById seleciona o id do nosso form em questao 
     * com o document selecionado, agora precisamos add um evento ao botao submit e para isso
     * usamos o método addEventListener('name', fn) e passamos um type e uma function como parametros
     * o event.preventDefault() para a açao de reflesh da pagina
    */
    onSubmit(){

        this.formEl.addEventListener('submit', event => {
    
            event.preventDefault()

            let btn = this.formEl.querySelector('[type=submit]')

            btn.disabled = true
            
            let values  = this.getValues()            

            this.getPhotos().then(

                content => {
                    values.photo = content

                    this.addLine(values) 

                    this.formEl.reset()

                    btn.disabled = false
                },

                e => {
                    console.error(e)
                }
            )
        })
    }
    getPhotos(){
        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [... this.formEl.elements].filter(item=>{
            
                if (item.name == 'photo'){
                    return item
                }
            })

            let file = elements[0].files[0]

            fileReader.onload = ()=>{
                
                resolve(fileReader.result)
            }

            fileReader.onerror = e=>{
               
                reject(e)
            }

            if (file){
                fileReader.readAsDataURL(file)
            }else{resolve('dist/img/boxed-bg.jpg')}
        })   
    }

    getValues(){
        
        let user = {}
        let elements = [... this.formEl.elements]

        elements.forEach((field, index) => {

            if (field.name == 'gender') {
                
                if (field.checked) {
                    user[field.name] = field.value
                }
            } else if (field.name=='admin'){
                user[field.name] = field.checked
            }
            else {
                    user[field.name] = field.value
                }
        })
        
        return new User(

            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin    
        )  
    }

    /**
    * funçao que add linha de dados de users
    */
    addLine(dataUser){
       let tr = document.createElement('tr')
        tr.innerHTML = 
          `<td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
           <td>${dataUser.name}</td>
           <td>${dataUser.email}</td>
           <td>${(dataUser.admin)?'Sim':'Não'}</td>
           <td>${Utils.dateFormat(dataUser.register)}</td>
           <td>
               <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
               <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
           </td>`
        
       this.tableIdEl.appendChild(tr)
    }
}