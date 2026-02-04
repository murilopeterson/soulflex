
    class Database {
        constructor(dbName) {
            this.base = dbName
            this.data = this.readAll()
        }

        create(data) {
            this.data.push(data)
            this.save()
        }

        readAll() {
            return JSON.parse(localStorage.getItem(this.base)) ?? []
        }

        read(index) {
            return this.data[index]
        }

        update(index, data) {
            this.data[index] = data
            this.save()
        }

        delete(index) {
            this.data.splice(index,1)
            this.save()
        }

        deleteAll() {

        }

        export () {

        }

        save() {
            localStorage.setItem(this.base, JSON.stringify(this.data))
            this.data = this.readAll()
        }

        sortBy(key) {
            return this.data.sort((a, b) => (
                a[key]?.trim().toLowerCase() || '').localeCompare(
                    b[key]?.trim().toLowerCase() || ''))
        }

        filterBy(key, value) {
            return this.data.filter(item => item[key]?.toLowerCase().includes(value.toLowerCase()));
        }

        where(param) {

        }

    }

    class Autocomplete {
        constructor(inputElement, suggestions) {
            this.inputElement = inputElement;
            this.suggestions = suggestions;
            this.filteredSuggestions = [];
            this.currentFocus = -1;
        
            // Eventos
            this.inputElement.addEventListener("input", () => this.onInput());
            this.inputElement.addEventListener("keydown", (e) => this.onKeyDown(e));
        }
    
        onInput() {
            const inputValue = this.inputElement.value;
            this.filteredSuggestions = this.suggestions.filter(suggestion =>
                suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
            );
            if(inputValue!="")
                this.showSuggestions();
            else
                this.clearSuggestions();
        }
    
        showSuggestions() {
            
            this.clearSuggestions();
        
            const suggestionsContainer = document.createElement("div");
            suggestionsContainer.setAttribute("class", "autocomplete-items");
            this.inputElement.parentNode.appendChild(suggestionsContainer);
        
            this.filteredSuggestions.forEach((suggestion, index) => {
                const suggestionItem = document.createElement("div");
                suggestionItem.innerHTML = `<strong>${suggestion.substr(0, this.inputElement.value.length)}</strong>${suggestion.substr(this.inputElement.value.length)}`;
                suggestionItem.addEventListener("click", () => {
                    this.inputElement.value = suggestion;
                    this.clearSuggestions();
                });
                suggestionsContainer.appendChild(suggestionItem);
            });
        }
    
        clearSuggestions() {
            const items = document.querySelectorAll(".autocomplete-items");
            items.forEach(item => item.remove());
        }
    
        onKeyDown(e) {
            const items = document.querySelectorAll(".autocomplete-items div");
            if (e.keyCode === 40) { // tecla para baixo
                this.currentFocus++;
                this.addActive(items);
            } else if (e.keyCode === 38) { // tecla para cima
                this.currentFocus--;
                this.addActive(items);
            } else if (e.keyCode === 13) { // tecla Enter
                e.preventDefault();
                if (this.currentFocus > -1 && items[this.currentFocus]) {
                items[this.currentFocus].click();
                }
            }
        }
    
        addActive(items) {
            if (!items) return;
            this.removeActive(items);
            if (this.currentFocus >= items.length) this.currentFocus = 0;
            if (this.currentFocus < 0) this.currentFocus = items.length - 1;
            items[this.currentFocus].classList.add("autocomplete-active");
        }
        
        removeActive(items) {
            items.forEach(item => item.classList.remove("autocomplete-active"));
        }
    }

    const input = document.getElementById("customer");

    const suggestions = [ "Alvorada", "Araújo", "Armazém", "Atual", "Bellus", "Casa Cris", "Casa Nova", "Castro", "Cenário", "Chimango", "Brasil", "Colchões e Complementos", "Martins", "Confortt", "Durma Bem", "Mangalô", "Estação Centro", "T-63", "FA", "Buriti", "Home", "IG", "Imperador", "Kasa", "Itaberai", "King", "L&G", "Lema", "Lih", "Lua Nova", "Outlet", "Paraiso", "Perfect Night", "Pioneira", "Pousare", "Quero Quero", "R2", "Real", "Realeza", "Rezende", "Calaça", "Sawama", "Sleep Love", "Sonhar", "Bolimar", "Sonhare", "MR", "RA", "FA", "Viva", "Vuler", "Viva", "Telma" ];

    new Autocomplete(input, suggestions);

    class AppForm{
        constructor(){

            const orderlist = new Database("OrdersList")
            this.data = orderlist.readAll()

            const list = document.getElementById("list")
            this.holidays = [
                    "01-01","03-04",
                    "04-18","04-21",
                    "05-01","05-24",
                    "06-19","07-26",
                    "09-07","10-12",
                    "10-24","10-28",
                    "11-02","11-15",
                    "11-20","12-25"
                ]
        }

        checkDeadline(entry, deadlineCountDays) {
            let workingDays = 0;
            let deadline = new Date(entry);

            while (workingDays < deadlineCountDays) {
                deadline.setDate(deadline.getDate() + 1);
                
                if (this.isWorkingDay(deadline, this.holidays)) {
                    workingDays++;
                }
            }

            return deadline;
        }

        isWorkingDay(date) {
            const weekday = date.getDay();
            const formatedDate = date.toISOString().slice(5, 10);

            return weekday !== 0 && weekday !== 6 && !this.holidays.includes(formatedDate);
        }

        updateList(){
            list.innerHTML = "";

            let obj = []

            Object.keys(this.data).forEach(element => {

                const elem = this.data[element]
                const entry = new Date(elem.entry)

                
                const finalDeadline = this.checkDeadline(elem.entry, elem.deadlineCountDays);

                const diffInMs   = new Date(finalDeadline) - new Date()
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
                
                const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado" ]
                const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

                const today = new Date(finalDeadline.toISOString().split('T')[0])
                const weekday = today.getDay()

                let obj1 = {

                    'osnumber':     elem.osnumber,
                    'entry':        `${entry.getDate()+1} de ${months[entry.getMonth()]}`,
                    'customer':     elem.customer,
                    'dateLimit':    `${finalDeadline.getDate()} de ${months[finalDeadline.getMonth()]}`,
                    'finalCount':   diffInDays,
                    'weekday':      weekdays[weekday]

                }

                obj.push(obj1)
                
            })

            obj.sort((a, b) => a.finalCount - b.finalCount);

            Object.keys(obj).forEach(element => {

                let finalCount = Math.round(obj[element].finalCount)
                
                let summaryClass = finalCount <= 1 ? "red" : (finalCount >= 6 ? "green" : "yellow" )

                finalCount = finalCount < 1 ? "Atrasado" : "Restam " + finalCount + " dia(s)"


                list.innerHTML += `
                    <details>
                        <summary class="${summaryClass}">
                            <span><b>${obj[element].osnumber}</b></span><em>${finalCount}</em></summary>
                        <article>
                            <header>
                                <h2>${obj[element].customer}</h2>
                                <p>Data da venda: ${obj[element].entry}</p>
                                <p>Data prazo: ${obj[element].weekday}, ${obj[element].dateLimit}</p>
                            </header>
                            <section>
                                <h3>Itens:</h3>
                                <ul>
                                    <li>Item 1 <span>qtd. 1</span></li>
                                    <li>Item 2 <span>qtd. 1</span></li>
                                    <li>Item 3 <span>qtd. 1</span></li>
                                    <li>Item 4 <span>qtd. 1</span></li>
                                    <li>Item 5 <span>qtd. 1</span></li>
                                    <li>Item 6 <span>qtd. 1</span></li>
                                </ul>   
                            </section>
                            <footer>
                                <input type="button" class="remove-btn" onclick="removeElement(${element})" value="Remover" />
                            </footer>
                        </article>

                    </details>
                `

            })
            
        }
        
    }

    const forms = document.querySelectorAll('form')

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            let entries     = new FormData(form)
            entries         = Object.fromEntries(entries)
            
            /* data = new Database("OrdersList")
            data.create(entries)
            
            new AppForm().updateList() */
            form.reset()
            toggleElement('mainForm')
        })
    })

    new AppForm().updateList()

    function clearInput(input){
        const items = document.querySelectorAll(".autocomplete-items");
        items.forEach(item => item.remove());
        return document.getElementById(input).value = ""
    }

    function toggleElement(id){
        const element = document.getElementById(id)
        element.classList.toggle("active")
    }

    function removeElement(id){
        const data = new Database("OrdersList")
        data.delete(id)
        new AppForm().updateList()
    }
