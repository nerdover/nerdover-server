<p align="center">
  <a href="https://github.com/nerdover" target="blank"><img src="https://avatars.githubusercontent.com/u/169288994?s=400&u=b5f9c0bc95989bd8ce67a242fecf3184fc765655&v=4" width="200" alt="Nerdover Logo" /></a>
</p>


## Description

### Category

#### Category Model

``` typescript
{
  //Unique ID for this category
  id: string,

  //Name for this category
  title: string,

  //Cover image file path for this category
  cover: string | undefined,

  //Date when the category was created
  createdAt: Date,

  //Date when the category was updated
  updatedAt: Date,
}
```

#### Create DTO

``` typescript
{
  //Required fields for create category
  id: string
  title: string,
  cover: string | undefined,
}
```

#### Update DTO

``` typescript
{
  //Required fields for update category
  title: string,
  cover: string | undefined,
}
```

#### Category API
- **GET** api/categories — get all categories
- **GET** api/categories/:categoryId — get a category from given category id
- **POST** api/categories — create a category from dto
- **PATCH** api/categories/:categoryId — update a category from given category id and dto
- **DELETE** api/categories/:category — delete a category from