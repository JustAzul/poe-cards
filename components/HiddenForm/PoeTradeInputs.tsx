interface Props {
    leagueName?: string,
    maxPrice: number,
    SearchString: string
}

export default function Inputs({
  leagueName, SearchString, maxPrice,
}: Props) {
  return (
        <>
            <input type="hidden" name="leagueName" value={leagueName} />
            <input type="hidden" name="itemName" value={SearchString} />
            <input type="hidden" name="maxPrice" value={maxPrice} />
        </>
  );
}
