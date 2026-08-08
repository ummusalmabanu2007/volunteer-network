acc_no = []
name = []
balance = []

while True:
    print("\n----- BANKING MANAGEMENT SYSTEM -----")
    print("1. Create Account")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Check Balance")
    print("5. Display All Accounts")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        a = input("Enter Account Number: ")
        n = input("Enter Customer Name: ")
        b = float(input("Enter Initial Balance: "))

        acc_no.append(a)
        name.append(n)
        balance.append(b)

        print("Account Created Successfully!")

    elif choice == 2:
        a = input("Enter Account Number: ")

        if a in acc_no:
            i = acc_no.index(a)
            amt = float(input("Enter Deposit Amount: "))
            balance[i] += amt
            print("Deposit Successful")
            print("Current Balance:", balance[i])
        else:
            print("Account Not Found")

    elif choice == 3:
        a = input("Enter Account Number: ")

        if a in acc_no:
            i = acc_no.index(a)
            amt = float(input("Enter Withdraw Amount: "))

            if amt <= balance[i]:
                balance[i] -= amt
                print("Withdrawal Successful")
                print("Current Balance:", balance[i])
            else:
                print("Insufficient Balance")
        else:
            print("Account Not Found")

    elif choice == 4:
        a = input("Enter Account Number: ")

        if a in acc_no:
            i = acc_no.index(a)
            print("\nAccount Number:", acc_no[i])
            print("Customer Name:", name[i])
            print("Balance:", balance[i])
        else:
            print("Account Not Found")

    elif choice == 5:
        if len(acc_no) == 0:
            print("No Accounts Available")
        else:
            print("\n----- ACCOUNT DETAILS -----")
            for i in range(len(acc_no)):
                print("Account No:", acc_no[i])
                print("Customer Name:", name[i])
                print("Balance:", balance[i])
                print("-------------------------")

    elif choice == 6:
        print("Thank You!")
        break

    else:
        print("Invalid Choice")