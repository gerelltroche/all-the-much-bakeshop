export default function IngredientsPage() {
  const cookies = [
    {
      name: "Signature Vanilla Royal Icing",
      ingredients: "Powdered Sugar, Water, Corn Syrup, Meringue Powder (Modified Food Starch, Dried Egg Whites, Sugar, Gum Arabic, Sodium Aluminosilicate, Citric Acid, Potassium Sorbate, Artificial Flavor), Artificial Vanilla Extract (Water, Alcohol, Artificial Flavors), Cornstarch, Vegetable Glycerin, Vanilla Powder, Gum Arabic, Lemon Juice, Food Coloring, Cream of Tartar."
    },
    {
      name: "House Vanilla Sugar Cookies",
      description: "Cookie:",
      ingredients: "Unsalted Butter (Sweet Cream, Natural Flavoring), Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Granulated Sugar, Light Brown Sugar (Sugar, Molasses), Eggs, Powdered Sugar (Sugar, Cornstarch), Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Salt, Baking Soda, Cream of Tartar."
    },
    {
      name: "Cookies and Cream",
      ingredients: "Unsalted Butter (Sweet Cream, Natural Flavoring), Granulated Sugar, Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Dutch Process Cocoa Powder (Cocoa [processed with alkali]), Eggs, Light Brown Sugar (Sugar, Molasses), Powdered Sugar (Sugar, Cornstarch), Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Whole Milk (Milk, Vitamin D3), Cornstarch, Salt, Baking Soda, Cream of Tartar."
    },
    {
      name: "Apple Pie a la Mode",
      ingredients: "Browned Butter (Sweet Cream, Natural Flavoring), Bread Flour (Enriched Flour [Wheat Flour, Malted Barley Flour, Niacin, Reduced Iron, Thiamin Mononitrate, Riboflavin, Folic Acid]), All-Purpose Flour (Unbleached Hard Red Wheat Flour, Malted Barley Flour), Granulated Sugar, Eggs, Apple Cider Syrup, Homemade Toffee (Butter, Sugar, Vanilla Extract), Light Brown Sugar (Sugar, Molasses), Freeze Dried Apple Powder (Apples), Powdered Sugar (Sugar, Cornstarch), Whole Milk (Milk, Vitamin D3), Cornstarch, Salt, Baking Soda, Cinnamon, Cream of Tartar, Vanilla Extract (Water, Alcohol, Vanilla Bean Extractives), Nutmeg."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Cookie Ingredients</h1>
        </div>

        <div className="space-y-8">
          {cookies.map((cookie, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200"
            >
              <h2 className="text-2xl font-bold text-amber-800 mb-4">{cookie.name}</h2>
              {cookie.description && (
                <p className="text-amber-700 font-semibold mb-2">{cookie.description}</p>
              )}
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
