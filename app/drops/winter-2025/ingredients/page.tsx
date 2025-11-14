export default function IngredientsPage() {
  const cookies = [
    {
      name: "Signature Vanilla Royal Icing",
      ingredients: "Powdered Sugar, Water, Corn Syrup, Meringue Powder (Modified Food Starch, Dried Egg Whites, Sugar, Gum Arabic, Sodium Aluminosilicate, Citric Acid, Potassium Sorbate, Artificial Flavor), Artificial Vanilla Extract (Water, Alcohol, Artificial Flavors), Cornstarch, Vegetable Glycerin, Vanilla Powder, Gum Arabic, Lemon Juice, Food Coloring, Cream of Tartar."
    },
    {
      name: "House Vanilla Sugar Cookies",
      ingredients: "Unsalted Butter (Sweet Cream, Natural Flavoring), Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Granulated Sugar, Light Brown Sugar (Sugar, Molasses), Eggs, Powdered Sugar (Sugar, Cornstarch), Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Salt, Baking Soda, Cream of Tartar."
    },
    {
      name: "Cookies and Cream",
      ingredients: "Unsalted Butter (Sweet Cream, Natural Flavoring), Granulated Sugar, Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Dutch Process Cocoa Powder (Cocoa [processed with alkali]), Eggs, Light Brown Sugar (Sugar, Molasses), Powdered Sugar (Sugar, Cornstarch), Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Whole Milk (Milk, Vitamin D3), Cornstarch, Salt, Baking Soda, Cream of Tartar."
    },
    {
      name: "Apple Pie a la Mode",
      ingredients: "Browned Butter (Sweet Cream, Natural Flavoring), Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Granulated Sugar, Eggs, Apple Cider Syrup, Homemade Toffee (Butter, Sugar, Salt, Vanilla Extract), Light Brown Sugar (Sugar, Molasses), Freeze Dried Apple Powder (Apples), Powdered Sugar (Sugar, Cornstarch), Whole Milk (Milk, Vitamin D3), Cornstarch, Salt, Baking Soda, Cinnamon, Cream of Tartar, Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Nutmeg."
    }
  ];

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Cookie Ingredients</h1>
          <div className="mt-6">
            <a
              href="https://www.instagram.com/allthemuchbakeshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow us on Instagram
            </a>
          </div>
        </div>

        <div className="space-y-8">
          {cookies.map((cookie, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200"
            >
              <h2 className="text-2xl font-bold text-amber-800 mb-4">{cookie.name}</h2>
              <div className="text-gray-700 leading-relaxed">
                <span className="font-semibold text-amber-700">Ingredients: </span>
                {cookie.ingredients}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-100 border-2 border-amber-300 rounded-lg p-6">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-bold text-amber-800">CONTAINS: WHEAT, MILK, EGG.</p>
            <p className="font-semibold">MAY CONTAIN: PEANUTS, TREE NUTS, AND SOY.</p>
            <p className="mt-4">
              <span className="font-semibold">Made by:</span> All the Much Bake Shop<br />
              12808 Cane Pole Ct. Orlando, FL 32828
            </p>
            <p className="mt-2 font-semibold italic">
              MADE IN A COTTAGE FOOD OPERATION THAT IS NOT SUBJECT TO FLORIDA&apos;S FOOD SAFETY REGULATIONS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
