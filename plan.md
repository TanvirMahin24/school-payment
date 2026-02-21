I want to add two more reports pages. Make sure only selected tenants data is visible in these reports pages. One called Yearly Expense Report and Second one is called Yearly Income Report. I want to have printing ability same as the income expense statement. Also there is a name of institution change base don the selected tenant that also needs to be incorporated. Need to add these new pages link to the sidebar as well

Yearly Expense Report:

- It will have 14 rows (Title of Columns, 12 month's row and Total Row)
- It will have n+2 columns (Month Name, n = each expense category will have it's own col, Total column)
- The Total row will show col wise total values and the last total will be bold and highlighted.

Yearly Income Report:

- It will have 14 rows (Title of Columns, 12 month's row and Total Row)
- It will have n+3 columns (Month Name, n = each grade for the selected tenant will have it's own col, Total column, Students(count of student of that have payment entry for that month))
- The Total row will show col wise total values and the last total col will have colspan=2 and show the total amount in bold and highlighted. It is the final total of the table.
- Below the total row, right aligned I want to show the list of the Revenue category and there yearly total.
- At the very end one final Total (summation of revenue category totals + table's final total)

I want a 3rd page now. This page will be called: School and Primary report. This will show the total monthly income and expense of school and primary tenant. user will select year, month then submit to see report.

- It will have table of 4 col:Institution, Income, Expense, Student
- First row will have labels,
- second row will have institutaion name of tenant school, income of selected month's school tenant, expense of selected month's school tenant. And then show the sum of payment entry count for that month of primary + school combined. This payment entry count will have rowspan = 2
- third row will have institutaion name of tenant primary, income of selected month's primary tenant, expense of selected month's primary tenant.
- Then a text called total Revenue for (institution name of school) (this is sum of revenue of that month of school)
- Then a text called total Revenue for (institution name of primary) (this is sum of revenue of that month of primary)
- Then it will have a Final total (bold and highlighted): (primary income + school income + revenue school + revenue primary)
