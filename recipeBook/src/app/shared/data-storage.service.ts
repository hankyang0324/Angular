import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators'; 
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
    constructor(private http: Http, 
                private recipeService: RecipeService,
                private authService: AuthService) {}

    storeRecipes() {
        const token = this.authService.getIdToken();
        return this.http.put('https://ng-recipe-book-a032c.firebaseio.com/recipes.json'+token,this.recipeService.getRecipes());
    }

    getRecipes() {
        const token = this.authService.getIdToken();
        
        this.http.get('https://ng-recipe-book-a032c.firebaseio.com/recipes.json?auth='+token)
        .pipe(map(
            (response: Response) => {
                const recipes: Recipe[] = response.json();
                for (let recipe of recipes) {
                    if(!recipe['ingredients']) {
                        recipe['ingredients'] = [];
                    }
                }
                return recipes;
            }
        ))
        .subscribe(
            (recipes: Recipe[]) => {
                this.recipeService.setRecipes(recipes);
            }
        );
      }
}