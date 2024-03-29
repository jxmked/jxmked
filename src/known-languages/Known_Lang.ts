/**
 * Known Languages
 * Desc: Known/Used languages to create or develop something...
 * 
 * HTML structure
 * [Default State]
 * - div#main-languages
 *   - div
 *     - label
 *       - (string)
 *       - span.tooltip
 *         - (string)
 *     
 *     - div
 *       - div
 *         - span[] (This must be a bars) (Define background color and width in style attr)
 * 
 *     - div
 *       - ul
 *         - li[] (This must be a language color, name and percentages)
 *           - span (Bullet)
 *           - p (Programming language name)
 *           - span (Percentages)
 * 
 * [Loading State]
 * - div#main-languages.loading
 *   - div
 *     - label
 *       - (string)
 *       - span.tooltip
 *         - (string)
 * 
 *     - div.loading-state
 *       - div
 *         - div
 *       - span
 *         - (string)
 * 
 * 
 * */

import {envRes} from "globals";
import Label from "modules/label";
import createElement from "modules/createElement";
import getRepos from "modules/get_repos";
import createBarGraph from "create-bar-graph";
import createListItem from "create-list-item";
import {fallbackEmpty} from "Helpers";

export default class Known_Lang {
    
    private static PLACEMENT:HTMLElement = document.getElementById("main-about")!;
    private static BASE:HTMLElement = createElement("div", {id:"main-languages"}); // #main-languages
    private static CONTAINER:HTMLElement = createElement("div"); // Base container
    private static TEXT_CONTAINER:HTMLElement = createElement("span"); // Text interact
    private thenCallback:Function;
    
    /**
     * Calculated Languages in Percentage
     * */
    private COUNTED_LANGS:{[key:string]:number};
    
    constructor() {
        
        this.COUNTED_LANGS = {};
        this.thenCallback = () => {};
        
        // Add label
        Known_Lang.CONTAINER.appendChild(new Label({
            title: "Known Languages"}).html);
        
        this.display_loading_screen();
        
        Known_Lang.BASE.appendChild(Known_Lang.CONTAINER);
        Known_Lang.PLACEMENT.parentNode!.insertBefore(Known_Lang.BASE, Known_Lang.PLACEMENT.nextSibling);
    }
    
    start():void {
        getRepos().then((repos:RepoProperties[]) => {
            
            this.__calculate(repos);
            
            // Sort COUNTED_LANGS by value
            // Min -> Max
            const entries:[string, number][] = Object.entries(this.COUNTED_LANGS);
            const rebuild:{[key:string]:number} = {};
            const skips:string[] = (envRes.get("known-lang-skip") || []).map((x:string) => x.toLowerCase());
            
            entries.sort((a, b) => a[1] - b[1]);
            
            // Rebuild object
            entries.forEach((item:[string, number]) => {
                if(skips.indexOf(item[0].toLowerCase()) == -1)
                    rebuild[item[0]] = item[1];
            });
            
            /**
             * Convert to percentages
             * */
            const sum:number = Object.values(rebuild).reduce((x, y) => x + y);
            
            this.COUNTED_LANGS = Object.fromEntries(Object.entries(rebuild).map(([lang, count]) => {
                return [lang, (count / sum) * 100]
            }))
            
            // Remove all child element from container
            // except the label tag
            let last:ChildNode|null = null;
            let first:ChildNode|null = null;
            
            do {
                if(last && first)
                    Known_Lang.CONTAINER.removeChild(last);
                
                last = Known_Lang.CONTAINER.lastChild;
                first = Known_Lang.CONTAINER.firstChild;
            } while(last != first);
            
            Known_Lang.BASE.classList.remove("loading");
            
            this.createDOMElements();
            this.thenCallback(); // Done 
        }).catch((err:any) => {
            Known_Lang.TEXT_CONTAINER.innerText = "Failed to load";
            
            console.error(err);
        });
    }
    
    createDOMElements():void {
        const barGraph:createBarGraph = new createBarGraph();
        const listItem:createListItem = new createListItem();
        
        const pert:{[key:string]:number} = this.COUNTED_LANGS;
        const keys:string[] = Object.keys(pert);
        
        let index:number = keys.length;
        let ival = window.setInterval(() => {
            try {
                
                const lang:string = fallbackEmpty(keys[--index], "{lang_name}");
                
                // Add Item into Bar Graph
                barGraph.item({
                    name:lang,
                    value:pert[lang as keyof typeof pert]
                });
                
                // Add Item to Item List
                listItem.item({
                    name:lang,
                    value:pert[lang as keyof typeof pert]
                });
            } catch(TypeError) {
                clearInterval(ival);
            }
        }, 0);
        
        Known_Lang.CONTAINER.appendChild(barGraph.html);
        Known_Lang.CONTAINER.appendChild(listItem.html);
    }
    
    __calculate(repos:RepoProperties[]):void {
        /**
         * Sum each unique languages has been used each repository
         * */
        const calculated:{[key:string]:number} = {};
        
        // Get language dictionary
        Object.values(repos).forEach(({languages, name}) => {
            Object.entries(languages).forEach(([lang, count]) => {
                if(calculated.hasOwnProperty(lang)){
                    calculated[lang] += count
                    return;
                }
                
                calculated[lang] = count;
            });
        });
        
        this.COUNTED_LANGS = calculated;
    }
    
    
    async display_loading_screen():Promise<void> {
        Known_Lang.BASE.classList.add("loading");
        
        const container:HTMLElement = createElement("div", {
            "class":"loading-state"
        });
        
        const waveContainer:HTMLElement = createElement("div");
        const waveMotion:HTMLElement = createElement("div");
        
        Known_Lang.TEXT_CONTAINER.innerText = "Loading...";
        
        waveContainer.appendChild(waveMotion);
        container.appendChild(waveContainer);
        container.appendChild(Known_Lang.TEXT_CONTAINER);
        Known_Lang.CONTAINER.appendChild(container);
    }
    
    catch(err:any):void {
        console.error(err);
    }
    
    then(callback:Function):void {
        this.thenCallback = callback;
    }
}

