interface Props {
    leagueName?: string,
    Currency: string,
    SearchString: string
}

export default function Inputs({ leagueName, Currency, SearchString }: Props) {
  return (
        <>
            <input type="hidden" name="league" value={leagueName} />
            <input type="hidden" name="online" value="x" />
            <input type="hidden" name="buyout_currency" value={Currency} />
            <input type="hidden" name="name" value={SearchString} />
        </>
  );
}