find ./ -type f -exec sed -i -E 's/(\.\.\/)+async/@async/g' {} \;
