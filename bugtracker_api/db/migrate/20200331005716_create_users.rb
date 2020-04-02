class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :lname
      t.text :fname
      t.string :email
      t.string :thumbnail
      t.timestamps
    end
  end
end
