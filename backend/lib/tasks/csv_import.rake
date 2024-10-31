require "#{Rails.root}/config/environment"
require 'csv'

namespace :csv_import do
  desc "nutrientsをcsvファイルからimportする"
  task :nutrients_intake_standards, [:file_path] => :environment do |t, args|
    args.with_defaults(:file_path => "./common_data/nutrients_intake_standards.csv")
    path = Rails.root.join(args.file_path)
    puts path
    list = []
    CSV.foreach(path, headers: true) do |row|
      nutrient_id = Nutrient.find_or_create_by!(name: row["nutrients_name"]).id
      unit = row["unit"]
      if /(?<age_from>\d+)～(?<age_to>\d+)\((?<age_type>.+)\)/ =~ row["age"]
        age_from = age_from.to_i
        age_to = age_to.to_i
        if age_type == "月"
          age_from = age_from / 10
          age_to = age_to / 10
        end
      else
        raise ApplicationError::InvalidNutrientsAgeRangeError, row["age"]
      end
      nutrients_intake_standard = {
        nutrient_id: nutrient_id,
        unit: unit,
        age_from: age_from,
        age_to: age_to,
      }
      list << nutrients_intake_standard.merge({
        content: row["female"].tr(',', '').to_i,
        gender: "female"
      })
      list << nutrients_intake_standard.merge({
        content: row["male"].tr(',', '').to_i,
        gender: "male"
      })
    end
    list.each do |data|
       temp = NutrientsIntakeStandard.new(data)
       unless temp.valid?
         puts temp.errors.inspect
         puts data
         abort
       end
       temp.save
    end
    puts 'success'
  end

  desc "nutrientsをcsvファイルからimportする"
  task :nutrients, [:file_path] => :environment do |t, args|
    args.with_defaults(:file_path => "./common_data/nutrients.csv")
    #do stuff [...]
    path = Rails.root.join(args.file_path)
    list = []
    CSV.foreach(path, headers: true) do |row|
      list << {
          name: row["name"],
      }
    end
    begin
      Nutrient.create!(list)
      puts "インポート完了!!"
    rescue ActiveModel::UnknownAttributeError => invalid
      puts "インポートに失敗：UnknownAttributeError"
    end
  end
    
  desc "ingredients_nutrientsをxlsファイルからimportする"
  task :ingredients_nutrients, [:file_path] => :environment do |t, args|
    args.with_defaults(:file_path => "./common_data/ingredients_nutrients.xlsx")
    path = Rails.root.join(args.file_path)
    IngredientsNutrientsImportService::Importer.new(path: path).execute
  end


end
