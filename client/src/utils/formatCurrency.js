export const formatCurrency=(value)=>{

return new Intl.NumberFormat(
"en-BD",
{
 style:"currency",
 currency:"BDT",
 maximumFractionDigits:0
}
)
.format(value);

};