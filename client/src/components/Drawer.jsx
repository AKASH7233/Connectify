
import PropTypes from 'prop-types';

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"


export function SheetSide({icon}) {
    

    const SHEET_SIDES = ["right"];
    return (
        <div className="grid grid-cols-2 gap-2">
            {SHEET_SIDES.map((side) => (
                <Sheet key={side}>
                    <SheetTrigger asChild>
                        <button>{icon}</button>
                    </SheetTrigger>
                    <SheetContent side={side} className='bg-white opacity-100' >
                        <SheetHeader>
                            <SheetTitle className='items-center'>Profile</SheetTitle>
                            <SheetDescription>
                                See Profile Details of the user
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            Add more Details
                        </div>
                        {/* <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                        </SheetFooter> */}
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    )
}


SheetSide.propTypes = {
    icon: PropTypes.object.isRequired,
};

